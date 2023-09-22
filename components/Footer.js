import { DiscordLogoIcon, TwitterLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

function Footer({lightBG, darkBG, otherClasses}) {
  return (
    <footer className={`${lightBG} dark:${darkBG} ${otherClasses}`}>
      <div className="mx-auto w-full p-10 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="https://getinfr.com/" className="flex items-center">
              <img src="/infr.png" className="h-8 mr-3" alt="Infr Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Infr</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://getinfr.com/docs" className="hover:underline">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="https://getinfr.com/" className="hover:underline">
                    Homepage
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://github.com/infrhq" className="hover:underline ">
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/ZAejZCzaPe" className="hover:underline">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://getinfr.com/privacy" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://getinfr.com/terms" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{' '}
            <a href="https://flowbite.com/" className="hover:underline">
              Infr™
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <a href="https://discord.gg/ZAejZCzaPe" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <DiscordLogoIcon className="w-4 h-4" />
              <span className="sr-only">Discord community</span>
            </a>
            <a href="https://x.com/infrhq" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <TwitterLogoIcon className="w-4 h-4" />
              <span className="sr-only">Twitter page</span>
            </a>
            <a href="https://github.com/infrhq" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <GitHubLogoIcon className="w-4 h-4" />
              <span className="sr-only">GitHub account</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
