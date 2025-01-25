"use client"
import { motion } from 'framer-motion'

export default function Blog() {
  const blogPosts = [
    {
      title: "5 Tips for Effective Case Management",
      excerpt: "Discover strategies that can help you streamline your practice efficiency.",
      image: "/blog-1.jpg",
      category: "Case Management"
    },
    {
      title: "Understanding Client Confidentiality in the Digital Age",
      excerpt: "Learn about modern challenges and solutions for maintaining client privacy.",
      image: "/blog-2.jpg",
      category: "Digital Privacy"
    },
    {
      title: "How to Choose the Right Tech Tools for Your Firm",
      excerpt: "A comprehensive guide to selecting legal technology solutions.",
      image: "/blog-3.jpg",
      category: "Legal Tech"
    },
    {
      title: "Best Practices for Legal Document Management",
      excerpt: "Optimize your document workflow with these proven strategies.",
      image: "/blog-4.jpg",
      category: "Document Management"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Blog & Resources</h2>
          <p className="text-gray-600">Stay informed with the latest trends in legal practice management</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              variants={{
                initial: { opacity: 0, y: 50 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <motion.div
                className="relative h-48 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* <img 
                  src={post.image} 
                  alt={post.title}
                  className="object-cover w-full h-full"
                /> */}
              </motion.div>
              <div className="p-6">
                <motion.span 
                  className="text-sm text-blue-600 font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {post.category}
                </motion.span>
                <h3 className="text-xl font-semibold mt-2 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <motion.button
                  className="text-blue-600 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read more →
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}