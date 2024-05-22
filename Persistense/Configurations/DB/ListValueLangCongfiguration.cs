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
    public class ListValueLangCongfiguration : BaseConfiguration<ListValueLang>
    {
        public override void Configure(EntityTypeBuilder<ListValueLang> builder)
        {
            base.Configure(builder);
            builder.Property(e => e.Id).ValueGeneratedOnAdd();
            builder.Property(e => e.GroupCode).ValueGeneratedOnAdd();
            builder.Property(e => e.Value).ValueGeneratedOnAdd();
            builder.HasKey(e => new { e.Id, e.GroupCode, e.Value, e.LanguageCode });
            builder.ToTable("list_value_lang", "db");


        }
    }
}
