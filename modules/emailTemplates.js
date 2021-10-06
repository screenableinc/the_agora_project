
let orderDetails = "<head>\n" +
    "    <title>Verification</title>\n" +
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
    "        .orderDetails p{\n" +
    "            margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;\n" +
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
    "\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body style=\"background-color: #f4f4f5;\">\n" +
    "<table bgcolor=\"#FFFFFF\" cellpadding=\"0\" cellspacing=\"0\" class=\"nl-container\" role=\"presentation\" style=\"table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;\" valign=\"top\" width=\"100%\">\n" +
    "    <tbody><tr>\n" +
    "        <td style=\"text-align: center;\">\n" +
    "            <table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" id=\"body\" style=\"background-color: #fff; width: 100%; max-width: 680px; height: 100%;\">\n" +
    "                <tbody><tr>\n" +
    "                    <td>\n" +
    "                        <table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"page-center\" style=\"text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;\">\n" +
    "                            <tbody><tr>\n" +
    "                                <td>\n" +
    "                                    <img src=\"/public/images/logo_clear.png\">\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td colspan=\"2\" style=\"-ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #e01253; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 24px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;\">Hi <span id=\"username\">user</span> .</td>\n" +
    "                            </tr>\n" +
    "                            <tr><td style=\"width: 50%;margin-bottom: 15px\">\n" +
    "                                your order has been <span id=\"verb\">approved</span> .\n" +
    "                            </td>\n" +
    "\n" +
    "                            </tr>\n" +
    "\n" +
    "\n" +
    "                            <tr>\n" +
    "                                <td>\n" +
    "                                    <p style=\"margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;\"><strong><a id=\"product-link\" href=\"/{{plink}}\" rel=\"noopener\" style=\"text-decoration: none; color: #0068A5;\" target=\"_blank\">{{productName}}</a></strong></p>\n" +
    "\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <br>\n" +
    "                            <tr>\n" +
    "                                <td style=\"-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;\">\n" +
    "                                    <table>\n" +
    "                                        <tr>\n" +
    "                                            <td style=\"width: 25%\">\n" +
    "                                                <img width=\"180px\" src={{piurl}} alt=\"\">\n" +
    "                                            </td>\n" +
    "                                            <td class=\"orderDetails\">\n" +
    "                                                <p style=\"margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;\"><strong>Vendor</strong>: <a id=\"vendor-link\" href={{vlink}} rel=\"noopener\" style=\"text-decoration: underline; color: #0068A5;\" target=\"_blank\">{{vendorname}}</a></p>\n" +
    "                                                <p><strong>price</strong>: <span id=\"productPrice\">{{price}}</span></p>\n" +
    "                                                <p><strong>Quantity</strong>: <span id=\"productQty\">{{qty}}</span></p>\n" +
    "                                                <p><strong>Total</strong>: <span id=\"productTotal\">{{total}}</span></p>\n" +
    "                                                <p><strong>Method of Payment</strong>: <span id=\"paymentMethod\">{{method}}</span></p>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                    </table>\n" +
    "\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr>\n" +
    "                                <td>\n" +
    "                                    <a data-click-track-id=\"37\" href=\"https://www.vendnbuy.com/\" style=\"margin-top: 36px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: #e01253; border-radius: 28px; display: block; text-align: center; text-transform: uppercase\" target=\"_blank\">\n" +
    "                                        Continue Shopping\n" +
    "                                    </a>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "\n" +
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
    orderDetails:orderDetails
}