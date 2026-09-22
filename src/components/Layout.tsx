import React from "react";
import { Phone, MapPin, Clock, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {children}

        <footer
          className="relative bg-black py-12 min-h-screen flex items-center"
          style={{ boxShadow: "0 -8px 12px rgba(255,60,60,0.15)" }}
        >
          <div className="relative z-10 max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-red-700 font-bold text-lg mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  {t("footer.quickLinks")}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/rates" className="text-gray-400 hover:text-red-500 transition-colors">
                      {t("menu.rateService")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                      {t("menu.contact")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#roster"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {t("menu.roster")}
                    </Link>

                  </li>
                  <li>
                    <Link to="/news" className="text-gray-400 hover:text-red-500 transition-colors">
                      {t("menu.news")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-red-700 font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t("footer.locationTitle")}
                </h3>
                <a
                  href="https://maps.app.goo.gl/VZxajTY5vTgBPx5q8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors block"
                >
                  {t("footer.locationLine1")}
                  <br />
                  {t("footer.locationLine2")}
                  <br />
                  {t("footer.locationLine3")}
                </a>
              </div>

              <div>
                <h3 className="text-red-700 font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t("footer.hoursTitle")}
                </h3>
                <p className="text-gray-400">
                  {t("footer.hoursLine1")}
                  <br />
                  {t("footer.hoursLine2")}
                </p>
              </div>

              <div>
                <h3 className="text-red-700 font-bold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t("footer.contactTitle")}
                </h3>
                <a
                  href="tel:+61417888123"
                  className="text-2xl font-bold text-white hover:text-red-500 transition-colors"
                  style={{ textShadow: "0 0 10px rgba(255,40,40,0.9)" }}
                >
                  0417 888 123
                </a>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-red-500 via-red-700 to-red-900 opacity-30 mb-8" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-500 text-sm">
                © 2025{" "}
                N5m.
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 blur-sm" />
        </footer>
      </main>
    </div>
  );
};

export default Layout;
