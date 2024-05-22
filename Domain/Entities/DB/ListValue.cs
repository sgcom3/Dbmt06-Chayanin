using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class ListValue : EntityBase
    {
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int? ValueId { get; set; }
		public string GroupCode { get; set; }
		public string Value { get; set; }
		public string Description { get; set; }
		public string ParentGroupCode { get; set; }
		public string ParentValue { get; set; }
		public int? Sequence { get; set; }
        public string InterfaceMappingCode { get; set; }
		public bool Active { get; set; }
        public string Color { get; set; }
        public ICollection<ListValueLang> ListValueLangs { get; set; }

	}
}
