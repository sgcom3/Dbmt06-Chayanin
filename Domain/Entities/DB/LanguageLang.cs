using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class LanguageLang : EntityBase
    {
        public string LanguageCode { get; set; }
        public string LanguageCodeForName { get; set; }
        public string LanguageName { get; set; }
        public string Description { get; set; }
        public bool? Active { get; set; }
    }
}
