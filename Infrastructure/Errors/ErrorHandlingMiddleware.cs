using Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Application.Interfaces;
using System.Linq;

namespace Infrastructure.Errors;

public abstract record ErrorResponseType
{
    private readonly JsonSerializerOptions _jsonOption = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public record Error(string code) : ErrorResponseType
    {
        public override string CreateResponse() => JsonSerializer.Serialize(this, _jsonOption);
    }

    public record RestError(ErrorMessage error) : ErrorResponseType
    {
        public override string CreateResponse()
        {
            return error.TranslateFlag == null || error.TranslateFlag == false
                ? JsonSerializer.Serialize(error, _jsonOption)
                : this.error.TranslatedMessage;
        }
    }

    public record RestErrorList(IEnumerable<ErrorMessage> errorMessages, bool single) : ErrorResponseType
    {
        public override string CreateResponse()
        {
            List<ErrorMessage> errors = errorMessages.Where(e => e.TranslateFlag == null || e.TranslateFlag == false).ToList();
            List<string> translateErrors = errorMessages.Where(e => e.TranslateFlag == true).Select(e => e.TranslatedMessage).ToList();
            string result = JsonSerializer.Serialize(new { single, errors, translateErrors }, _jsonOption);

            return result;
        }
    }

    private ErrorResponseType() { }
    public abstract string CreateResponse();
}

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger, RequestDelegate next)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context, ICleanDbContext db, ICurrentUserAccessor user)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error middleware");
            await HandleExceptionAsync(context, ex, db, user);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception, ICleanDbContext db, ICurrentUserAccessor user)
    {
        ErrorResponseType errorResponse = null;
        string errorMessageDetail = string.Empty;

        switch (exception)
        {
            case RestException re:
                List<ErrorMessage> translates = new();
                foreach (ErrorMessage error in re.Errors)
                {
                    ErrorMessage translated = await error.GetMessage(db, user.Language);
                    translates.Add(translated);
                }

                if (translates.Count == 1)
                {
                    errorResponse = new ErrorResponseType.RestError(translates[0]);
                    errorMessageDetail = await GetErrorMessageDetail(db, translates[0]);
                }
                else
                {
                    errorResponse = new ErrorResponseType.RestErrorList(translates, re.SingleMessage ?? false);
                    errorMessageDetail = await GetErrorMessageDetail(db, translates);
                }

                context.Response.StatusCode = (int)re.Code;
                break;

            case DbUpdateConcurrencyException ce:
                errorResponse = new ErrorResponseType.Error("message.STD00019");
                errorMessageDetail = await GetErrorMessageDetail(db, "message.STD00019");
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case DbUpdateException ue:
                if (ue.InnerException is SqlException sqlException)
                {
                    errorResponse = new ErrorResponseType.Error(GetExceptionMessage(sqlException));
                    errorMessageDetail = await GetErrorMessageDetail(db, GetExceptionMessage(sqlException));
                }
                else
                {
                    errorResponse = new ErrorResponseType.Error(ue.InnerException.Message);
                    errorMessageDetail = await GetErrorMessageDetail(db, ue.InnerException.Message);
                }

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;

            case Exception e:
                errorResponse = new ErrorResponseType.Error(GetExceptionMessage(e));
                errorMessageDetail = await GetErrorMessageDetail(db, GetExceptionMessage(e));
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;

            default:
                errorResponse = new ErrorResponseType.Error(exception.Message);
                errorMessageDetail = await GetErrorMessageDetail(db, exception.Message);
                break;
        }

        object json = new
        {
            TraceId = context.TraceIdentifier,
            Error = errorMessageDetail,
        };

        // Uncomment the line below if you need to log the error
        // await (context.RequestServices.GetService(typeof(IActivityLogService)) as IActivityLogService).LogForce(db, JsonSerializer.Serialize(json), "5000", default);

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(errorResponse.CreateResponse());
    }

    private string GetExceptionMessage(SqlException exception)
    {
        return exception.Number == 547
            ? exception.Message.ToLower().Contains("delete")
                ? $"message.SQL{exception.Number}D"
                : $"message.SQL{exception.Number}A"
            : $"message.SQL{exception.Number}";
    }

    private string GetExceptionMessage(Exception exception)
    {
        if (exception.Message.Contains("Value cannot be null") && ((ArgumentException)exception).ParamName == "entity")
        {
            return "message.STD00019";
        }
        return string.IsNullOrEmpty(exception.Message) ? "Error" : exception.Message;
    }

    private async Task<string> GetErrorMessageDetail(ICleanDbContext db, string code)
    {
        string message = await db.ExecuteScalarAsync<string>(
            @"select message_desc from su.message where message_code = @messageCode and language_code = 'EN' limit 1",
            new { messageCode = code.Replace("message.", "") },
            default);

        return message ?? code;
    }

    private async Task<string> GetErrorMessageDetail(ICleanDbContext db, ErrorMessage errorMessage)
    {
        string message = await db.ExecuteScalarAsync<string>(
            @"select message_desc from su.message where message_code = @messageCode and language_code = 'EN' limit 1",
            new { messageCode = errorMessage.Code.Replace("message.", "") },
            default);

        return string.Format(message, errorMessage.Parameters);
    }

    private async Task<string> GetErrorMessageDetail(ICleanDbContext db, List<ErrorMessage> errorMessages)
    {
        string message = string.Empty;

        foreach (ErrorMessage error in errorMessages)
        {
            message += string.Format(
                await db.ExecuteScalarAsync<string>(
                    @"select message_desc from su.message where message_code = @messageCode and language_code = 'EN' limit 1",
                    new { messageCode = error.Code.Replace("message.", "") },
                    default),
                error.Parameters) + "\n";
        }

        return message;
    }
}
