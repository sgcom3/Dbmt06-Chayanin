using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class ListValueLang : EntityBase
    {
		public int? Id { get; set; }
		public string GroupCode { get; set; }
		public string Value { get; set; }
		public string LanguageCode { get; set; }
		public string ValueText { get; set; }

	}
}
