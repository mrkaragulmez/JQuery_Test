using JQuery_Test.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Web.Mvc;
using System.IO;
using System.Linq;
using System.Web.Services;
using System.Reflection;
using System.Reflection.Emit;

namespace JQuery_Test.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        public ActionResult YeniUrun()
        {
            return View();
        }
        public ActionResult Anasayfa()
        {


            //Users exm = new Users
            //{
            //    ID = 4,
            //    _name = "Deneme",
            //    _surname = "deneme"
            //};

            //Type tip = typeof(string);
            //MemberInfo[] uyeler = tip.GetMembers();
            //PropertyInfo propertyInfo = tip.GetProperty("_name"); //NULL
            //propertyInfo.SetValue(null, "15");

            //propertyInfo.GetValue(null);

            //Type cins = typeof(Users);

            //ConstructorInfo cstr = cins.GetConstructor(Type.EmptyTypes);
            //object classobject = cstr.Invoke(new object[] { });

            //MethodInfo minfo = cins.GetMethod("ItsNumber");
            //object data = minfo.Invoke(classobject, new object[] { 100 });

            //AppDomain dd = new;
            //dd.GetAssemblies();
            //System.Reflection.Assembly.loca
            //Activator.CreateInstance()
            //var instance = Activator.CreateInstance(typeof(Users));



            return View();
        }

        public ActionResult YeniKullanici()
        {

            return View();
        }

        public ActionResult Kullanicilar()
        {

            return View();
        }

        public ActionResult EditKullanici(int id)
        {
            return View();
        }

        public ActionResult EditKullaniciJSON(int id)
        {
            string jsonFile = @"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\" + "database.json";
            var json = System.IO.File.ReadAllText(jsonFile);
            List<Users> items = JsonConvert.DeserializeObject<List<Users>>(json);
            var currentuser = items.Find(x => x.ID == id);
            return Json(currentuser, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetUserList()
        {
            using (FileStream fs = new FileStream(@"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\database.json", FileMode.Open))
            {
                using (StreamReader reader = new StreamReader(fs, Encoding.GetEncoding("utf-8")))
                {
                    return Content(reader.ReadToEnd());
                }
            }
        }

        public ActionResult SilKullanici(int UserId)
        {
            string jsonFile = @"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\database.json";
            var json = System.IO.File.ReadAllText(jsonFile);
            List<Users> items = JsonConvert.DeserializeObject<List<Users>>(json);
            var currentuser = items.Find(x => x.ID == UserId);
            items.Remove(currentuser);
            json = JsonConvert.SerializeObject(items);
            System.IO.File.WriteAllText(jsonFile, json);
            return RedirectToAction("Kullanicilar");
        }


        [HttpPost]
        public ActionResult SaveData(Users dataset, bool isNew)
        {
            if (isNew)
            {
                try
                {
                    string countFile = @"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\adet.txt";
                    string countstr = System.IO.File.ReadAllText(countFile);
                    int newcount = Convert.ToInt32(countstr) + 1;
                    countstr = newcount.ToString();
                    System.IO.File.WriteAllText(countFile, countstr);

                    dataset.ID = newcount;

                    string jsonFile = @"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\database.json";
                    var json = System.IO.File.ReadAllText(jsonFile);
                    List<Users> items = JsonConvert.DeserializeObject<List<Users>>(json);
                    items.Add(dataset);
                    json = JsonConvert.SerializeObject(items);
                    System.IO.File.WriteAllText(jsonFile, json);

                }
                catch (Exception ex)
                {
                    //throw new Exception("Hata :" + ex.Message);
                    return Json(new { error = "Kayıt işlemi gerçekleştirilemedi. Hata : " + ex.Message }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { message = "Kayıt işlemi gerçekleştirildi. " }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                try
                {
                    string jsonFile = @"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\database.json";
                    var json = System.IO.File.ReadAllText(jsonFile);
                    List<Users> items = JsonConvert.DeserializeObject<List<Users>>(json);
                    var currentuser = items.Find(x => x.ID == dataset.ID);

                    items.Remove(currentuser);
                    items.Add(dataset);

                    json = JsonConvert.SerializeObject(items);
                    System.IO.File.WriteAllText(jsonFile, json);
                }
                catch (Exception ex)
                {
                    //throw new Exception("Hata :" + ex.Message);
                    return Json(new { error = "Kayıt işlemi gerçekleştirilemedi. Hata : " + ex.Message }, JsonRequestBehavior.AllowGet);
                }

                //return Json(new { msg= "Kayıt işlemi gerçekleştirildi." });
                return Json(new { message = "Kayıt işlemi gerçekleştirildi. " },JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult GetData()
        {
            using (FileStream fs = new FileStream(@"C:\Users\mrkaragulmez\source\repos\JQuery_Test\JQuery_Test\Data\json.json", FileMode.Open))
            {
                using (StreamReader reader = new StreamReader(fs, Encoding.GetEncoding("windows-1254")))
                {
                    return Content(reader.ReadToEnd());
                }
            }
        }
    }
}