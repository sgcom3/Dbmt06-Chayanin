﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.DB
{
    public class CurrencyLang : EntityBase
    {
        public string CurrencyCode { get; set; }
        public string LanguageCode { get; set; }
        public string CurrencyName { get; set; }
    }
}