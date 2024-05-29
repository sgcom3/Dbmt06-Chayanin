namespace Domain.Entities.DB 
{
    public class Holiday: EntityBase
    {
        public string HolidayId { get; set; }
        public string HolidayDate { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
    }
}