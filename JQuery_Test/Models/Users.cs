using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JQuery_Test.Models
{
    public class Users
    {
        public int ID { get; set; }
        public string _name { get; set; }
        public string _surname { get; set; }
        public string _mail { get; set; }
        public string _tel { get; set; }
        public string _gender { get; set; }
        public string _hobies { get; set; }
        public string _city { get; set; }
        public string _district { get; set; }
        public string _neighbourhood { get; set; }
        public string _newspaper { get; set; }

        public List<Products> Product{ get; set; }

        public class Products
        {
            public int ID { get; set; }
            public string _prod { get; set; }
            public string _quantitiy { get; set; }
            public string _price { get; set; }
            public string _caption { get; set; }
        }


    }
}