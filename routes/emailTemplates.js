
var candidateJoinEmail="<head>\n" +
    "    <title>Election Joined</title>\n" +
    "    <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\">\n" +
    "    <meta content=\"width=device-width\" name=\"viewport\">\n" +
    "    <style type=\"text/css\">\n" +
    "        @font-face {\n" +
    "            font-family: &#x27;Postmates Std&#x27;;\n" +
    "            font-weight: 600;\n" +
    "            font-style: normal;\n" +
    "            src: local(&#x27;Postmates Std Bold&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-bold.woff) format(&#x27;woff&#x27;);\n" +
    "        }\n" +
    "\n" +
    "        @font-face {\n" +
    "            font-family: &#x27;Postmates Std&#x27;;\n" +
    "            font-weight: 500;\n" +
    "            font-style: normal;\n" +
    "            src: local(&#x27;Postmates Std Medium&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-medium.woff) format(&#x27;woff&#x27;);\n" +
    "        }\n" +
    "\n" +
    "        @font-face {\n" +
    "            font-family: &#x27;Postmates Std&#x27;;\n" +
    "            font-weight: 400;\n" +
    "            font-style: normal;\n" +
    "            src: local(&#x27;Postmates Std Regular&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-regular.woff) format(&#x27;woff&#x27;);\n" +
    "        }\n" +
    "    </style>\n" +
    "    <style media=\"screen and (max-width: 680px)\">\n" +
    "        @media screen and (max-width: 680px) {\n" +
    "            .page-center {\n" +
    "                padding-left: 0 !important;\n" +
    "                padding-right: 0 !important;\n" +
    "            }\n" +
    "\n" +
    "            .footer-center {\n" +
    "                padding-left: 20px !important;\n" +
    "                padding-right: 20px !important;\n" +
    "            }\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body style=\"background-color: #f4f4f5;\">\n" +
    "<table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;\">\n" +
    "    <tbody><tr>\n" +
    "        <td style=\"text-align: center;\">\n" +
    "            <table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" id=\"body\" style=\"background-color: #fff; width: 100%; max-width: 680px; height: 100%;\">\n" +
    "                <tbody><tr>\n" +
    "                    <td>\n" +
    "                        <table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"page-center\" style=\"text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;\">\n" +
    "                            <tbody><tr>\n" +
    "                                <td style=\"padding-top: 24px;\">\n" +
    "                                    <img src=\"http://www.screenableinc.com/logo.png\" style=\"width: 56px;\">\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td colspan=\"2\" style=\"padding-top: 72px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;\">Welcome !!</td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td style=\"padding-top: 48px; padding-bottom: 48px;\">\n" +
    "                                    <table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%\">\n" +
    "                                        <tbody><tr>\n" +
    "                                            <td style=\"width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81\"></td>\n" +
    "                                        </tr>\n" +
    "                                        </tbody></table>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td style=\"-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;\">\n" +
    "                                    $$name <br>  You have are now a candidate in the $$electionName<br><strong>Position:</strong> $$position\n <br> Your access token is $$accessToken," +
    " please use this when logging in to manage your campaign <br> GOOD LUCK!!!" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td style=\"padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;\">\n" +
    "                                    Please tap the button below to go the login page.\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td>\n" +
    "                                    <a data-click-track-id=\"37\" href=\"https://www.screenableinc.com/\" style=\"margin-top: 36px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: #00cc99; border-radius: 28px; display: block; text-align: center; text-transform: uppercase\" target=\"_blank\">\n" +
    "                                        Manage Campaign\n" +
    "                                    </a>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            </tbody></table>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody></table>\n" +
    "             </td>\n" +
    "    </tr>\n" +
    "    </tbody></table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</body>"


module.exports={
    candidateJoinEmail:candidateJoinEmail
}