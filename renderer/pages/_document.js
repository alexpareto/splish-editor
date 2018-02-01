import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import * as globalStyles from '../globalStyles';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    return { html, head, errorHtml, chunks };
  }

  render() {
    return (
      <html>
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @font-face {
              font-family: 'CircularStd-Book';
              src:
                   url('/static/fonts/CircularStd-Book.otf');
              font-weight: normal;
            }

            @font-face {
              font-family: 'CircularStd-Bold';
              src:
                   url('/static/fonts/CircularStd-Bold.otf');
              font-weight: bolder;
            }

            @font-face {
              font-family: 'CircularStd-Medium';
              src:
                   url('/static/fonts/CircularStd-Medium.otf');
              font-weight: bold;
            }
          `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",this.t=+new Date,this.zendeskHost="baroohelp.zendesk.com",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();
            /*]]>*/`,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
             fbq('init', '143929559735996');
            fbq('track', 'PageView');`,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              src="https://www.facebook.com/tr?id=143929559735996&ev=PageView&noscript=1"
            />
          </noscript>
        </Head>
        <body
          style={{
            overflow: 'hidden',
            height: '100vh',
            userSelect: 'none',
            backgroundColor: globalStyles.background,
            fontFamily: globalStyles.fontFamily,
            color: globalStyles.textColor,
            fontSize: globalStyles.globalFontSize,
            boxSizing: 'border-box',
            padding: '0',
            margin: '0',
          }}
        >
          <div
            style={{
              height: '20px',
              WebkitAppRegion: 'drag',
            }}
          />
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
