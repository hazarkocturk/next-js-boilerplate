'use client'
import  { useEffect, useState } from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SignInTab from './_components/sign-in-tab'
import SignUpTab from './_components/sign-up-tab'
import {authClient} from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import EmailVerificationTab from './_components/email-verification-tab'
import ForgotPasswordTab from './_components/forgot-password-tab'

type TabsValue = 'signin' | 'signup' | 'email-verification' |"forgot-password";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabsValue>('signin');
  

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null  ) {
        router.push('/');
      }
    });
  }, [router]);

  return (
    <Tabs value={selectedTab} onValueChange={t => setSelectedTab(t as TabsValue)} className='max-auto w-full my-6 px-4'>
      {(selectedTab === 'signin' || selectedTab === 'signup') && (
        <TabsList>
          <TabsTrigger value="signin" >Sign In</TabsTrigger>
          <TabsTrigger value="signup" >Sign Up</TabsTrigger>
        </TabsList>
      )}
  
        <TabsContent value="signin">
      <Card>
          <CardHeader className='text-2xl font-bold'>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab onSignInSuccess={(emailFromForm) => {
                setEmail(emailFromForm);
                setSelectedTab("email-verification");
                
              }}
              openForgotPasswordTab={ () => setSelectedTab("forgot-password")}
              />
          </CardContent>
      </Card>
        </TabsContent>
        <TabsContent value="signup">
        <Card>
          <CardHeader className='text-2xl font-bold'>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab onSignUpSuccess={(emailFromForm) => {
                setEmail(emailFromForm);
                setSelectedTab("email-verification");
              }}/>
          </CardContent>
          </Card>
        </TabsContent>
               <TabsContent value="email-verification">
        <Card>
          <CardHeader className='text-2xl font-bold'>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerificationTab email={email} />
          </CardContent>
          </Card>
        </TabsContent>
       
               <TabsContent value="forgot-password">
        <Card>
          <CardHeader className='text-2xl font-bold'>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPasswordTab openSignInTab={() => setSelectedTab("signin")} />
          </CardContent>
          </Card>
        </TabsContent>
    </Tabs>
  )
}

export default LoginPage 