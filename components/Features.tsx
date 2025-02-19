import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, CheckCircle } from "lucide-react"

const features = [
  {
    icon: <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Lightning Fast",
    description: "Optimized performance that keeps your workflow smooth and efficient."
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Secure by Design",
    description: "Enterprise-grade security to protect your valuable data."
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Easy Integration",
    description: "Seamlessly connects with your existing tools and workflows."
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features that set us apart
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}