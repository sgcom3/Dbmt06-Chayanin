using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class ListGroup : EntityBase
    {
		public string GroupCode { get; set; }
		public int? Sequence { get; set; }
		public string Description { get; set; }
		public string? ParentGroupCode { get; set; }
		public bool Active { get; set; }
		public bool CanInsert { get; set; }
		public bool CanDelete { get; set; }
		public bool CanEdit { get; set; }

	}
}
