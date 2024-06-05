
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
    public class TerritoryLangConfiguration : BaseConfiguration<TerritoryLang>
    {
        public override void Configure(EntityTypeBuilder<TerritoryLang> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => e.TerritoryCode);
            builder.HasKey(e => e.LanguageCode);
            builder.ToTable("territory_lang", "db");
        }
    }
}
