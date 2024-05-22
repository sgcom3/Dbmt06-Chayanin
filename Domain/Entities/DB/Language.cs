using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class Language : EntityBase
    {
        public string LanguageCode { get; set; }
        public string Description { get; set; }
        public bool? Active { get; set; }
    }
}
