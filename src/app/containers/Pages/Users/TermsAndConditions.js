import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from "react";
import windowSize from "react-window-size";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Footer from "../../../components/Footers/Footer";
import Header from "../../../components/Headers/Header";

const useStyles = makeStyles((theme) => ({
    root: {
        // maxWidth: 645,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));


function TermsAndConditions(props) {
    const classes = useStyles();

    return (

        <div
            className="account-page">
            <div
                className="main-wrapper">
                <div className="home-section home-full-height">
                    <Header />

                    <div
                        className="content"
                        style={{ paddingTop: "180px" }}
                        position="absolute"

                    >
                        <div className="container-fluid">
                            <div
                                className="row"
                            // style={{ height: `${props.windowHeight}`, marginRight: "px" }}
                            >
                                <Card className={classes.root}>
                                    <CardHeader
                                        title="Terms & Conditions "
                                        subheader="Last Updated: September 14, 2016"
                                    />
                                    <CardContent>
                                        <ol>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Introduction:</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Welcome to <strong>IMEX Platform</strong></Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">These Terms of Service govern your use of our website located at <strong>imex-frontend.herokuapp.com </strong> operated by <strong>IMEX Platform</strong>.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Your agreement with us includes these Terms and our Privacy Policy. You acknowledge that you have read and understood Agreements, and agree to be bound of them.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">If you do not agree with Agreements, then you may not use the Service, but please let us know by emailing at <strong>support@ImexPlatform.com</strong> so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Communications:</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@ImexPlatform.com.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Purchases:</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">If you wish to purchase any product or service made available through Service (“Purchase”), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We may employ the use of third party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Contests, Sweepstakes and Promotions:</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Any contests, sweepstakes or other promotions made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Refunds</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We issue refunds for Contracts within 30 days of the original purchase of the Contract.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Content</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (“Content”). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">By posting Content on or through Service, You represent and warrant that:
                                                 <ul>
                                                        <li>
                                                            Content is yours and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms.
                                                     </li>
                                                        <li>
                                                            and that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.
                                                     </li>
                                                    </ul>
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service. You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">IMEX Platform has the right but not the obligation to monitor and edit all Content provided by users.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">In addition, Content found on or through this Service are the property of IMEX Platform or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</Typography>


                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Prohibited Uses</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:

                                                <ol>
                                                        <li>In any way that violates any applicable national or international law or regulation.</li>
                                                        <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                                                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation.</li>
                                                        <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                                                        <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
                                                        <li>
                                                            To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.
                                                        </li>
                                                        <li>
                                                            Additionally, you agree not to:
                                                            <ul>
                                                                <li>Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party’s use of Service, including their ability to engage in real time activities through Service.</li>
                                                                <li>Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.</li>
                                                                <li>Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.</li>
                                                                <li>Use any device, software, or routine that interferes with the proper working of Service.</li>
                                                                <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</li>
                                                                <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.</li>
                                                                <li>Attack Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
                                                                <li>Take any action that may damage or falsify Company rating.</li>
                                                                <li>Otherwise attempt to interfere with the proper working of Service.</li>
                                                            </ul>
                                                        </li>
                                                    </ol>
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Analytics</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We may use third-party Service Providers to monitor and analyze the use of our Service.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>No Use By Minors</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Service is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using Service, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of Service.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Accounts</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Intellectual Property</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of IMEX Platform and its licensors. Service is protected by copyright, trademark, and other laws of and foreign countries. Our trademarks may not be used in connection with any product or service without the prior written consent of IMEX Platform.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Copyright Policy</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to support@ImexPlatform.com, with the subject line: “Copyright Infringement” and include in your claim a detailed description of the alleged Infringement as detailed below, under “DMCA Notice and Procedure for Copyright Infringement Claims”</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">You may be held accountable for damages (including costs and attorneys’ fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.</Typography>

                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>DMCA Notice and Procedure for Copyright Infringement Claims</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):
                                                    <ul>
                                                        <li>an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright’s interest;</li>
                                                        <li>a description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work;</li>
                                                        <li>identification of the URL or other specific location on Service where the material that you claim is infringing is located;</li>
                                                        <li>your address, telephone number, and email address;</li>
                                                        <li>a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</li>
                                                        <li>a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.</li>
                                                    </ul>
                                                    You can contact our Copyright Agent via email at support@ImexPlatform.com.
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Error Reporting and Feedback</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">You may provide us either directly at support@ImexPlatform.com or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our Service (“Feedback”). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right, title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to the Feedback is not possible due to applicable mandatory laws, you grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Links To Other Web Sites</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Our Service may contain links to third party web sites or services that are not owned or controlled by IMEX Platform.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">IMEX Platform has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">For example, the outlined <a href="https://policymaker.io/terms-and-conditions/">Terms of Use</a> have been created using <a href="https://policymaker.io/">PolicyMaker.io</a>, a free web application for generating high-quality legal documents. PolicyMaker’s <a href="https://policymaker.io/terms-and-conditions/">Terms and Conditions generator</a> is an easy-to-use free tool for creating an excellent standard Terms of Service template for a website, blog, e-commerce store or app.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">YOU ACKNOWLEDGE AND AGREE THAT COMPANY SHALL NOT BE RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY POLICIES OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.</Typography>

                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Disclaimer Of Warranty</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS AVAILABLE” BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</Typography>

                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Limitation Of Liability</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS’ FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Terminationon Of Liability</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">If you wish to terminate your account, you may simply discontinue using Service.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Governing Law</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">These Terms shall be governed and construed in accordance with the laws of Vietnam, which governing law applies to agreement without regard to its conflict of law provisions.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding Service.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Changes To Service</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Amendments To Terms</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use Service.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Waiver And Severability</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">No waiver by Company of any term or condition set forth in Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Company to assert a right or provision under Terms shall not constitute a waiver of such right or provision.</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">If any provision of Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of Terms will continue in full force and effect.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Acknowledgement</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.</Typography>
                                            </li>
                                            <li>
                                                <Typography variant="h6" gutterBottom>Contact Us</Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">Please send your feedback, comments, requests for technical support by email: <b>support@ImexPlatform.com</b>.</Typography>
                                            </li>
                                        </ol>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        {/* <IconButton aria-label="add to favorites">
                                            <FavoriteIcon />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <ShareIcon />
                                        </IconButton> */}

                                    </CardActions>

                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer position={"relative"} />
            </div >
        </div >
    );
}

export default windowSize(TermsAndConditions);
