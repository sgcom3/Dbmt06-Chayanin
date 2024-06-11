using Application.Interfaces;
using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Persistense
{
    public partial class CleanDbContext : DbContext, ICleanDbContext
    {
        public DbSet<ListGroup> ListGroups { get; set; }
        public DbSet<ListValue> ListValues { get; set; }
        public DbSet<ListValueLang> ListValueLangs { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<LanguageLang> LanguageLangs { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<CountryLang> CountryLangs { get; set; }
        public DbSet<Territory> Territories { get; set; }
        public DbSet<TerritoryLang> TerritoryLangs { get; set; }
        public DbSet<CurrencyLang> CurrencyLangs { get; set; }


    }
}
