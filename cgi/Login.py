import sys
import chilkat

#  The mailman object is used for receiving (POP3)
#  and sending (SMTP) email.
mailman = chilkat.CkMailMan()

#  Any string argument automatically begins the 30-day trial.
success = mailman.UnlockComponent("30-day trial")
if (success != True):
    print ("Component unlock failed")
    sys.exit()

#  Set the POP3 server's hostname
mailman.put_MailHost("webmail.exeter.edu")

#  Set the POP3 login/password.
mailman.put_PopUsername("ahowe")
mailman.put_PopPassword("xx@pp1exx")

#  Indicate that we want TLS/SSL.  Also, set the port to 995:
mailman.put_MailPort(995)
mailman.put_PopSsl(True)

#  Read mail headers and one line of the body.
# bundle is a CkEmailBundle
bundle = mailman.CopyMail()

if (bundle == None ):
    print (mailman.lastErrorText())
    sys.exit()

for i in range(0,1):
    # email is a CkEmail
    try:
        email = bundle.GetEmail(i)
        print ("It works!")
    except:
        print("FAIL")
    
"""
    #  Display the From email address and the subject.
    print (email.ck_from())
    print (email.subject() + "\r\n")
"""
