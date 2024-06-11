using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class Territory : EntityBase
    {
        public string TerritoryCode { get; set; }
        public int? DisplaySeq { get; set; }
        public bool? Active { get; set; }
        public string? InterfaceMappingCode { get; set; }
    }
}
