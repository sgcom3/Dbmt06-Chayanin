using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class CountryLang : EntityBase
    {
        public string CountryCode { get; set; }
        public string LanguageCode { get; set; }
        public string? CountryName { get; set; }

    }
}