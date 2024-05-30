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
    public class CountryLangConfiguration : BaseConfiguration<CountryLang>
    {
        public override void Configure(EntityTypeBuilder<CountryLang> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => e.CountryCode);
            builder.HasKey(e => e.LanguageCode);
            builder.ToTable("country_lang", "db");
        }
    }
}
