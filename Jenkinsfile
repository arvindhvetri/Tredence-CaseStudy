pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "YOUR_DOCKERHUB_USERNAME" // Replace with ECR URL if using AWS ECR
        APP_NAME = "tredence-hr-designer"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'YOUR_GITHUB_REPOSITORY_URL'
            }
        }

        stage('Backend: Test & Lint') {
            steps {
                dir('backend') {
                    sh 'pip install -r requirements.txt'
                    // Add standard tests here if they exist
                    // sh 'pytest'
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dockerBackendImage = docker.build("${DOCKER_REGISTRY}/${APP_NAME}-backend:${TAG}", "./backend")
                    dockerFrontendImage = docker.build("${DOCKER_REGISTRY}/${APP_NAME}-frontend:${TAG}", "./frontend")
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') { // Use jenkins credential manager
                        dockerBackendImage.push()
                        dockerFrontendImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Requires the Jenkins K8s plugin and cluster kubeconfig correctly configured
                sh 'kubectl apply -f k8s/namespace.yaml'
                sh 'kubectl apply -f k8s/postgres.yaml'
                sh 'kubectl apply -f k8s/backend.yaml'
                sh 'kubectl apply -f k8s/frontend.yaml'
                
                // Trigger rolling restart of deployments
                sh 'kubectl rollout restart deployment/tredence-backend -n tredence'
                sh 'kubectl rollout restart deployment/tredence-frontend -n tredence'
            }
        }
    }

    post {
        success {
            echo "Successfully built and deployed Tredence HR Designer!"
        }
        failure {
            echo "Build failed. Inspect logs for details."
        }
    }
}
