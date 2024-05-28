using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class Country : EntityBase
    {
        public string CountryCode { get; set; }
        public string? TelCountryCode { get; set; }
        public bool Active { get; set; }
        public int? ZoneId { get; set; }
        public string? CurrencyCode { get; set; }
        public string? TrunkPrefix { get; set; }
        public string? Description { get; set; }
        public int? CountryImage { get; set; }
        public string? TerritoryCode { get; set; }
        public string? InterfaceMappingCode { get; set; }

    }
}