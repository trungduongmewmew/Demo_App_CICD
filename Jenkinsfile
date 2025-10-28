// File: Jenkinsfile

// --- KHAI BÁO BIẾN ---
// !!! THAY BẰNG TÊN IMAGE CỦA BẠN !!!
def DOCKER_IMAGE_NAME = "duongdt1998/demo-app-cicd" 
def KUBECONFIG_ID = "kubeconfig-creds"
def DOCKERHUB_CREDS_ID = "dockerhub-creds"
// ---------------------

pipeline {
    agent any // Chạy trên agent bất kỳ

    // --- PHẦN SỬA LỖI ---
    // Định nghĩa biến IMAGE_TAG ở đây
    // Nó sẽ tự động lấy số build (1, 2, 3...)
    environment {
        IMAGE_TAG = "${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
    }
    // --- HẾT PHẦN SỬA ---

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Dang keo code tu Git...'
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                // Sử dụng biến IMAGE_TAG đã định nghĩa ở trên
                echo "Dang build image: ${IMAGE_TAG}"
                script {
                    // Chạy lệnh docker build
                    docker.build(IMAGE_TAG, ".")
                }
            }
        }

        stage('3. Push Image to Docker Hub') {
            steps {
                echo "Dang day image ${IMAGE_TAG} len Docker Hub..."
                // Dùng 'chìa khóa' dockerhub-creds
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
                
                // Dùng 'chìa khóa' kubeconfig-creds
                withCredentials([file(credentialsId: KUBECONFIG_ID, variable: 'KUBECONFIG')]) {
                    
                    // 1. Áp dụng Service (để mở cổng)
                    sh 'kubectl apply -f k8s/service.yaml'

                    // 2. Áp dụng Deployment (tạo hoặc cập nhật cấu hình env)
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    
                    // 3. Cập nhật image cho deployment
                    // Sử dụng biến IMAGE_TAG
                    sh "kubectl set image deployment/demo-app-deployment demo-app-container=${IMAGE_TAG}"
                    
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
            // Sử dụng biến IMAGE_TAG
            sh "docker rmi ${IMAGE_TAG} || true"
        }
    }
}