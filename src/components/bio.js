/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["AUTO", "WEBP", "AVIF"]}
        src="../images/profile.jpg"
        width={100}
        height={100}
        quality={95}
        alt="Profile picture"
      />
      <h1>Hi 👋 I'm {author.name && author.name}</h1>
      <p>
        Passionate about building products and tools to automate workflows. I am
        independent Software Developer and Consultant based in India. You can
        know more about my work by following me on{" "}
        <a
          href={`https://twitter.com/${social?.twitter || ``}`}
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>{" "}
        and{" "}
        <a
          href="https://github.com/lakhansamani"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </p>
    </div>
  )
}

export default Bio
