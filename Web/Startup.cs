using Application;
using Domain;
using Infrastructure;
using Infrastructure.Errors;
using Infrastructure.Services.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistense;
using System.Diagnostics;
using System.Text.Json;
using Web.Filters.ProgramCode;

namespace Web;

public class Startup
{
    public Startup(IConfiguration configuration) => Configuration = configuration;

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationInsightsTelemetry();
        services.AddApplication();
        services.AddInfrastructure(Configuration);
        services.AddPersistence(Configuration);

        services.AddCors(options => options.AddDefaultPolicy(builder => builder.WithOrigins("*").WithHeaders("*").WithMethods("POST", "PUT", "GET", "DELETE").WithExposedHeaders("Content-Disposition")));

        services.AddControllers(options => options.ModelBinderProviders.RemoveType<DateTimeModelBinderProvider>()).AddJsonOptions(options =>
        {
            options.UseDateOnlyTimeOnlyStringConverters();
            options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
            options.JsonSerializerOptions.Converters.Add(new TimeSpanConverter());
            options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });

        services.AddSpaStaticFiles(configuration =>
        {
            configuration.RootPath = "ClientApp/dist/rx";
        });
        services.AddSignalR();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseCors();

        string[] supportedCultures = new[] { "en-US" };

        RequestLocalizationOptions localizationOptions = new RequestLocalizationOptions().SetDefaultCulture(supportedCultures[0]).AddSupportedCultures(supportedCultures).AddSupportedUICultures(supportedCultures);

        app.UseRequestLocalization(localizationOptions);

        ServiceActivator.Configure(app.ApplicationServices);

        if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseMiddleware<ErrorHandlingMiddleware>();
        app.UseStaticFiles();

        if (!env.IsDevelopment() || !Debugger.IsAttached) app.UseSpaStaticFiles();

        app.UseRouting();

        string pattern = env.IsDevelopment() && Debugger.IsAttached ? "{controller=Empty}/{action=Index}" : "{controller}/{action=Index}/{id?}";

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(name: "default", pattern: pattern);
            endpoints.MapHub<JobHub>("/job");
        });

        app.UseSpa(spa => spa.Options.SourcePath = "ClientApp");
    }
}
