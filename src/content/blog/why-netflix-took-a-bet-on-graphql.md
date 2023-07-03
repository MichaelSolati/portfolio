---
title: Why Netflix Took a Bet on GraphQL
description: Discover how Netflix migrated to GraphQL, improving their API architecture. Explore the advantages of GraphQL's precise data requests and enhanced performance. Find out why businesses should evaluate the benefits of adopting GraphQL.
pubDate: June 26 2023
hero: https://static-assets.amplication.com/blog/why-netflix-took-a-bet-on-graphql/hero.png
canonical: https://amplication.com/blog/why-netflix-took-a-bet-on-graphql
---

So you may have missed it, but about two weeks ago, the streaming giant Netflix shared the details of its massive leap forward by embracing GraphQL as its preferred API architecture. Let's dive into what Netflix did, why it made this bold move, how it executed the migration, and why other companies should seriously consider following suit.

If you're interested in reading about their experience, be sure to check out the [blog post](https://netflixtechblog.com/migrating-netflix-to-graphql-safely-8e1e4d4f1e72) on the Netflix Technology Blog. But do that after you read this blog post to get our opinion first!

## Netflix's Big Move

In 2022, Netflix migrated their iOS and Android apps to a GraphQL backend. Until then, they had used their own home-baked API framework, [Falcor](https://netflix.github.io/falcor/), to power their mobile apps. Interestingly, the Falcor Java implementation team also managed the API server.

Netflix's decision to adopt GraphQL was driven by its ambition to create a more flexible, efficient, and developer-friendly API architecture. Moving away from its monolithic REST API server, Netflix sought to empower its development teams, optimize the data transfer, and enhance the overall user experience.

By breaking up their Falcor monolith, they allowed every team to manage their own GraphQL API thanks to a federated GraphQL gateway; removing a burden from the Falcor Java team while empowering the other teams with ownership of the code they were writing.

## The Power of GraphQL

So, what makes GraphQL so compelling? First and foremost, it offers unparalleled flexibility. Unlike REST APIs, where clients are constrained by fixed data structures, GraphQL empowers clients to request the data they need, eliminating over-fetching and under-fetching data. This leads to faster load times, improved performance, and, ultimately, happier users.

GraphQL's declarative nature and powerful tooling also provide an enhanced developer experience. It simplifies data fetching and eliminates the need for multiple API endpoints, making development more efficient and productive. With GraphQL, developers can focus on delivering value without being hindered by rigid API structures.

## Netflix's Migration Journey

Now, let's look at how Netflix executed its migration to GraphQL. They approached the transition in two phases, ensuring a smooth and seamless integration.

### Phase 1 - Creating a GraphQL Shim Service

Netflix's first step involved creating a GraphQL shim service on their monolithic Falcor API. This allowed client engineers to swiftly adopt GraphQL and explore client-side concerns without disrupting the server-side infrastructure. To launch this phase safely, Netflix employed AB testing, evaluating the impact of GraphQL versus the legacy Falcor stack.

<figure>
  <img src="https://static-assets.amplication.com/blog/why-netflix-took-a-bet-on-graphql/0.webp" alt="Diagram of GraphQL Shim Service in front of Legacy API Monolith." style="margin-left: auto; margin-right: auto;" height="441" width="1100">
  <figcaption style="margin-left: auto; margin-right: auto; width: fit-content;">Diagram of GraphQL Shim Service in front of Legacy API Monolith.</figcaption>
</figure>
<br />

### Phase 2 - Replacing Falcor with a GraphQL Gateway

Then, Netflix deprecated the GraphQL shim service and the legacy Falcor API in favor of federated GraphQL services owned by domain teams. This decentralized approach enabled independent management and ownership of specific sections of the API. To ensure the correctness and functional accuracy of the migration, Netflix employed replay testing, comparing results between the GraphQL Shim and the new Video API service. They also leveraged sticky canaries, infrastructure experiments that assessed performance, and business metrics, to build confidence in the new GraphQL services.

<figure>
  <img src="https://static-assets.amplication.com/blog/why-netflix-took-a-bet-on-graphql/1.webp" alt="Diagram of Federated GraphQL Gateway replacing Shim Service." style="margin-left: auto; margin-right: auto;" height="568" width="1100">
  <figcaption style="margin-left: auto; margin-right: auto; width: fit-content;">Diagram of Federated GraphQL Gateway replacing Shim Service.</figcaption>
</figure>
<br />

## Why You Should Consider GraphQL?

Netflix's successful migration is a powerful example for other companies evaluating their API strategies. Here are some compelling reasons why GraphQL should be seriously considered:

1. **Increased Efficiency**: GraphQL optimizes data retrieval by allowing clients to request only the required data, eliminating unnecessary network overhead. This leads to faster load times, improved performance, and optimized resource utilization.
2. **Flexibility and Adaptability**: With GraphQL, companies can quickly iterate and innovate, responding to changing business needs and user demands. Its flexible nature allows seamless additions, modifications, and deprecations without breaking existing client implementations.
3. **Developer-Friendly**: GraphQL's declarative nature, comprehensive documentation, and robust tooling make it a developer's dream. It simplifies data fetching and enhances productivity, empowering developers to deliver value more effectively.
4. **Future-Proofing and Scalability**: GraphQL's flexibility and adaptability future-proof API infrastructures. It enables long-term scalability, forward compatibility, and easy integration with evolving technologies.

## Want to Make the Jump?

If you found this blog post interesting and are considering switching to GraphQL, first [give us a 🌟 on GitHub](https://github.com/amplication/amplication), and also be sure to check out [Amplication](https://amplication.com/). Besides excellent content like this, we also build the premiere open-source developer tool for generating scalable, secure, and extensible backends using technologies like GraphQL.

We're making it even faster than ever to build on our platform with our new Database Schema Import functionality, allowing you to seamlessly import your existing database schema into Amplication. This helps reduce the transition time from your old backend to your new one by preserving your underlying database so you can work on enhancing your services.

You can sign up for the [beta here](https://amplication.com/db-import-beta), migrate your backend, and build something as impressive as Netflix.

## Wrapping Up

Netflix's migration to GraphQL is a testament to the power and benefits of this revolutionary API architecture. By adopting GraphQL, Netflix achieved increased efficiency, flexibility, and developer-friendliness, while ensuring a seamless user experience. Other companies should take note of Netflix's success and seriously consider embracing GraphQL to take advantage of these benefits for themselves.

Adapting and staying ahead of the curve is critical as the technological landscape evolves. GraphQL presents a paradigm shift in API architecture, reimagining how data is exchanged between clients and servers. So, whether you're a small startup or a tech giant, you should explore the possibilities of GraphQL and join the ranks of companies (like Netflix and Amplication) embracing this technology.
