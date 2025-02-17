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
    public class ListGroupCongfiguration :BaseConfiguration<ListGroup>
    {
        public override void Configure(EntityTypeBuilder<ListGroup> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => e.GroupCode);
            builder.ToTable("list_group", "db");
        }
    }
}
