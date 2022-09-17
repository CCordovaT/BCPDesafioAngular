using System.Web;
using System.Web.Optimization;
using System.Web.UI.WebControls;

namespace BCP.Angular
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/bootstrapjs")
                .Include("~/Scripts/jquery.js")
                .Include("~/Content/bootstrap/js/popper.min.js")
                .Include("~/Content/bootstrap/js/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/scss/vendors/fontawesome/css/fontawesomecss")
                .Include("~/Content/scss/vendors/fontawesome/css/fontawesome.css")
                .Include("~/Content/scss/vendors/fontawesome/css/brands.css")
                .Include("~/Content/scss/vendors/fontawesome/css/solid.css")
                .Include("~/Content/scss/vendors/fontawesome/css/regular.css"));

            bundles.Add(new StyleBundle("~/Content/scss/css")
                .Include("~/Content/scss/main.css"));

            bundles.Add(new ScriptBundle("~/bundles/sweetalert2js")
                .Include("~/Content/sweetalert2/js/sweetalert2.js"));

            bundles.Add(new StyleBundle("~/bundles/sweetalert2css")
                .Include("~/Content/sweetalert2/css/sweetalert2.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include("~/Scripts/angular.js")
                .Include("~/Scripts/angular-ui-router.js")
                .Include("~/Scripts/angular-messages.js")
                .Include("~/Scripts/angular-local-storage.js"));

            bundles.Add(new ScriptBundle("~/bundles/app")
                .Include("~/app/app.js")
                .Include("~/app/app.routes.js")
                .Include("~/app/app.config.js")
                .Include("~/app/app.controller.js")
                .IncludeDirectory("~/app/components", "*.js", true)
                .IncludeDirectory("~/app/public", "*.js", true)
                .IncludeDirectory("~/app/shared", "*.js", true)
                .IncludeDirectory("~/app/private", "*.js", true));

            bundles.Add(new DynamicFolderBundle("js", "*.js", false, new JsMinify()));
            bundles.Add(new DynamicFolderBundle("css", "*.css", false, new CssMinify()));

#if DEBUG

            BundleTable.EnableOptimizations = false;

#else

            BundleTable.EnableOptimizations = true;

#endif

        }
    }
}
