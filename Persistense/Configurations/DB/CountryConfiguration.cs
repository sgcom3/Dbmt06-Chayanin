﻿using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistense.Configurations.DB
{
    public class CountryConfiguration : BaseConfiguration<Country>
    {
        public override void Configure(EntityTypeBuilder<Country> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => e.CountryCode);
            builder.HasMany(e => e.CountryLangs).WithOne().HasForeignKey(e => new { e.CountryCode});
            builder.ToTable("country", "db");
        }
    }
}