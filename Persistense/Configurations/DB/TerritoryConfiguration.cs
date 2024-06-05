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
    public class TerritoryConfiguration : BaseConfiguration<Territory>
    {
        public override void Configure(EntityTypeBuilder<Territory> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => e.TerritoryCode);
            builder.ToTable("territory", "db");
        }
    }
}