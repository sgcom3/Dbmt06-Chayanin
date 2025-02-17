﻿using Application.Behaviors;
using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities.DB;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.DB.DBMT06
{
    public class SaveCountry
    {
        public class Command : Domain.Entities.DB.Country, ICommand
        {

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ICleanDbContext _context;
            private readonly ICurrentUserAccessor _user;
            public Handler(ICleanDbContext context, ICurrentUserAccessor user)
            {
                _context = context;
                _user = user;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request.RowState == Domain.Entities.RowState.Add)
                {
                    var dupplicated = await _context.Set<Country>().FirstOrDefaultAsync(o => o.CountryCode == request.CountryCode, cancellationToken);
                    
                    if (dupplicated != null)
                    {
                        throw new RestException(HttpStatusCode.NotFound, "message.Dupplicated");
                    }
                    if (request.CountryLangs.Any() && request.CountryLangs.Any())
                    {
                        foreach (var item in request.CountryLangs)
                        {
                            item.CountryCode = request.CountryCode;
                        }
                    }
                    _context.Set<Country>().Add(request);
                }
                else
                {
                    foreach (var lang in request.CountryLangs)
                    {
                        _context.Entry(lang).Property(o => o.CountryName).IsModified = true;
                    }
                    

                    _context.Set<Country>().Attach(request);
                    _context.Entry(request).State = EntityState.Modified;
                    //_context.Entry(request).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                }

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
