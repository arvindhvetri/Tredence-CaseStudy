pipeline {
    agent { label 'Jen-Agent' }

    environment {
        // Your Docker Hub Repositories
        BACKEND_IMAGE  = 'arvindh01/hr-backend:latest'
        FRONTEND_IMAGE = 'arvindh01/hr-frontend:latest'
        
        // Your AWS EC2 Public IP
        WORKER_NODE_IP = '3.90.21.171' 
    }

    stages {
        stage('Clone Code from GitHub') {
            steps {
                // Clones your specific Tredence project
                git branch: 'main', url: 'https://github.com/arvindhvetri/Tredence-CaseStudy.git'
            }
        }

        stage('Cleanup Environment') {
            steps {
                sh '''
                    echo "🧹 Stopping current stack..."
                    docker-compose down || true

                    echo "🗑️ Removing old project images to save space..."
                    docker rmi $BACKEND_IMAGE $FRONTEND_IMAGE || true
                    
                    echo "♻️ Cleaning up dangling (unused) images..."
                    docker image prune -f
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "📦 Building Backend Image..."
                    docker build -t $BACKEND_IMAGE ./backend
        
                    echo "📦 Building Frontend Image..."
                    docker build -t $FRONTEND_IMAGE ./frontend
                '''
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                // Note: Ensure 'dockerhub-creds' exists in Jenkins -> Credentials
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds', 
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    sh '''
                        echo "🔐 Logging into Docker Hub..."
                        echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        
                        echo "🚀 Pushing Backend..."
                        docker push $BACKEND_IMAGE
                        
                        echo "🚀 Pushing Frontend..."
                        docker push $FRONTEND_IMAGE
                    '''
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                sh '''
                    echo "🚀 Starting containers with Docker Compose..."
                    # This uses your docker-compose.yml file in the root directory
                    docker-compose up -d
                '''
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment Successful! Access at http://${WORKER_NODE_IP}:5173"
        }
        failure {
            echo "❌ Pipeline Failed. Check the console output above."
        }
    }
}