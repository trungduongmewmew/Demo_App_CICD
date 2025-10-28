// File: Jenkinsfile


def DOCKER_IMAGE_NAME = "duongdt1998/demo-app-cicd" 
def KUBECONFIG_ID = "kubeconfig-creds"
def DOCKERHUB_CREDS_ID = "dockerhub-creds"
// ---------------------

pipeline {
    agent any 

   
    environment {
        IMAGE_TAG = "${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
    }
    

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Dang keo code tu Git...'
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                
                echo "Dang build image: ${IMAGE_TAG}"
                script {
                    
                    docker.build(IMAGE_TAG, ".")
                }
            }
        }

        stage('3. Push Image to Docker Hub') {
            steps {
                echo "Dang day image ${IMAGE_TAG} len Docker Hub..."
                
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDS_ID) {
                        docker.image(IMAGE_TAG).push()
                    }
                }
            }
        }

        stage('4. Deploy to Kubernetes') {
            steps {
                echo "Dang deploy image ${IMAGE_TAG} len K8s..."
                
                
                withCredentials([file(credentialsId: KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
                    
                    
                    sh 'kubectl apply -f k8s/service.yaml'

                    
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    
                    
                    sh "kubectl set image deployment/demo-app-deployment demo-app-container=${IMAGE_TAG}"
                    
                    
                    sh 'kubectl rollout status deployment/demo-app-deployment'
                }
            }
        }
    }

    post {
        
        always {
            echo 'Don dep...'
            
            
            sh "docker rmi ${IMAGE_TAG} || true"
        }
    }
}