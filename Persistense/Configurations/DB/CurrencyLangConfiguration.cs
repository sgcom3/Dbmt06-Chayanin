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
    public class CurrencyLangConfiguration : BaseConfiguration<CurrencyLang>
    {
        public override void Configure(EntityTypeBuilder<CurrencyLang> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => e.CurrencyCode);
            builder.HasKey(e => e.LanguageCode);
            builder.ToTable("currency_lang", "db");
        }
    }
}