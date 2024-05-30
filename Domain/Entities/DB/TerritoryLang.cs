using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class TerritoryLang : EntityBase
    {
        public string TerritoryCode { get; set; }
        public string LanguageCode { get; set; }
        public string TerritoryName { get; set; }
    }
}
