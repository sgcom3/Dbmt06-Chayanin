using Domain.Entities.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistense.Configurations.DB
{
    public class ListValueCongfiguration : BaseConfiguration<ListValue>
    {
        public override void Configure(EntityTypeBuilder<ListValue> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => new { e.GroupCode,e.Value});
            builder.HasMany(e => e.ListValueLangs).WithOne().HasForeignKey(e => new { e.GroupCode, e.Value });
            builder.Property(f => f.ValueId).ValueGeneratedOnAdd();
            builder.ToTable("list_value", "db");

        }
    }
}
