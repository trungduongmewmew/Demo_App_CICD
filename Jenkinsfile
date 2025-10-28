// File: Jenkinsfile

// --- KHAI BÁO BIẾN ---
// !!! THAY BẰNG TÊN IMAGE CỦA BẠN !!!
def DOCKER_IMAGE_NAME = "duongdt1998/demo-app-cicd" 
def KUBECONFIG_ID = "kubeconfig-creds"
def DOCKERHUB_CREDS_ID = "dockerhub-creds"
// ---------------------

pipeline {
    agent any // Chạy trên agent bất kỳ

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Dang keo code tu Git...'
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                // ${env.BUILD_NUMBER} là biến của Jenkins (1, 2, 3...)
                // Dùng nó làm tag cho image (ví dụ: my-app:1, my-app:2)
                def imageTag = "${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                
                echo "Dang build image: ${imageTag}"
                script {
                    // Chạy lệnh docker build
                    docker.build(imageTag, ".")
                }
            }
        }

        stage('3. Push Image to Docker Hub') {
            steps {
                def imageTag = "${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                
                echo "Dang day image ${imageTag} len Docker Hub..."
                // Dùng 'chìa khóa' dockerhub-creds
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDS_ID) {
                        docker.image(imageTag).push()
                    }
                }
            }
        }

        stage('4. Deploy to Kubernetes') {
            steps {
                def imageTag = "${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                
                echo "Dang deploy image ${imageTag} len K8s..."
                
                // Dùng 'chìa khóa' kubeconfig-creds
                withCredentials([file(credentialsId: KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
                    // Jenkins sẽ tự động dùng file KUBECONFIG này cho mọi lệnh kubectl
                    
                    // 1. Áp dụng Service (để mở cổng)
                    sh 'kubectl apply -f k8s/service.yaml'

                    // 2. Áp dụng Deployment (tạo hoặc cập nhật cấu hình env)
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    
                    // 3. Cập nhật image cho deployment
                    // Đây là lệnh quan trọng nhất:
                    // Bảo K8s tìm 'deployment/demo-app-deployment',
                    // trong đó tìm container 'demo-app-container',
                    // và SET IMAGE của nó thành image mới nhất
                    sh "kubectl set image deployment/demo-app-deployment demo-app-container=${imageTag}"
                    
                    // 4. Chờ K8s deploy xong và báo cáo
                    sh 'kubectl rollout status deployment/demo-app-deployment'
                }
            }
        }
    }

    post {
        // Luôn luôn chạy sau khi pipeline kết thúc (dù thành/bại)
        always {
            echo 'Don dep...'
            // Xóa image vừa build trên máy Jenkins để tiết kiệm dung lượng
            def imageTag = "${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
            // Bỏ qua lỗi nếu image không tồn tại
            sh "docker rmi ${imageTag} || true"
        }
    }
}