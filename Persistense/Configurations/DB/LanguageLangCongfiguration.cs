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
    public class LanguageLangCongfiguration : BaseConfiguration<LanguageLang>
    {
        public override void Configure(EntityTypeBuilder<LanguageLang> builder)
        {
            base.Configure(builder);
            builder.HasKey(e => new { e.LanguageCode,e.LanguageCodeForName});
            builder.Property(e => e.LanguageCode).ValueGeneratedOnAdd();
            builder.Property(e => e.LanguageCodeForName).ValueGeneratedOnAdd();
            builder.ToTable("language_lang", "db");

        }
    }
}
