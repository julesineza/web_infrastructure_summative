
const camera_btn_select = document.querySelector("#camera-card")

// Initializing the page
document.addEventListener('DOMContentLoaded', function() {
    // Auto-scroll to input section after a brief delay on page load
    setTimeout(function() {
        scrollToSection('input-section');
    }, 3000);
    
    // Set the default selected input option
    selectInputOption('upload');
});

// Function to scroll to a section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}



// Function to select input option
function selectInputOption(option) {
    // Remove active class from all cards and content
    document.querySelectorAll('.input-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelectorAll('.input-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected card and content
    document.getElementById(option + '-card').classList.add('active');
    document.getElementById(option + '-content').classList.add('active');
}

// Function to handle file upload
function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        // In a real app, this would process the image
        // For this UI demo, we'll just simulate extraction
        console.log('File selected:', input.files[0].name);
        
        // Simulate OCR extraction
        setTimeout(function() {
            document.getElementById('extracted-text').value = "amoxicillin 500mg oral capsule";
            scrollToSection('ocr-preview');
        }, 1000);
    }
}



// Function to process input based on selected option
function processInput(option) {
    // Show loading skeleton
    document.getElementById('loading-skeleton').classList.add('active');
    document.getElementById('drug-info').style.display = 'none';
    document.getElementById('no-results-error').style.display = 'none';
    document.getElementById('extraction-error').style.display = 'none';
    
    // Simulate processing delay
    setTimeout(function() {
        // Hide loading skeleton
        document.getElementById('loading-skeleton').classList.remove('active');
        
        // Show results based on option
        if (option === 'text') {
            const textInput = document.querySelector('.text-input').value.trim();
            if (textInput.toLowerCase().includes('amoxicillin')) {
                document.getElementById('drug-info').style.display = 'block';
                scrollToSection('results');
            } else if (textInput === '') {
                alert("Please enter medicine information");
            } else {
                document.getElementById('no-results-error').style.display = 'block';
                scrollToSection('results');
            }
        } else {
            // For upload and camera, we'll show the OCR preview
            document.getElementById('extracted-text').value = "amoxicillin 500mg oral capsule";
            scrollToSection('ocr-preview');
        }
    }, 1500);
}

// Function to search FDA database (UI only)
function searchFDADatabase() {
    // Show loading skeleton
    document.getElementById('loading-skeleton').classList.add('active');
    document.getElementById('drug-info').style.display = 'none';
    document.getElementById('no-results-error').style.display = 'none';
    document.getElementById('extraction-error').style.display = 'none';
    
    // Simulate API call delay
    setTimeout(function() {
        // Hide loading skeleton
        document.getElementById('loading-skeleton').classList.remove('active');
        
        // Show results
        const extractedText = document.getElementById('extracted-text').value;
        if (extractedText.toLowerCase().includes('amoxicillin')) {
            document.getElementById('drug-info').style.display = 'block';
        } else if (extractedText === '') {
            document.getElementById('extraction-error').style.display = 'block';
        } else {
            document.getElementById('no-results-error').style.display = 'block';
        }
        
        scrollToSection('results');
    }, 1500);
}




/// my code ----------

let cameraStream = null;

function handleCamera() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById("photo")
    const captureBtn = document.getElementById('capture-btn');
    const context = canvas.getContext('2d');

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    // Request access to the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing the camera: ", error);
        });

    // Capture photo on button click
    captureBtn.addEventListener('click', () => {
        video.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        video.classList.add('hidden');
    });
}

// Add this function to stop camera when switching tabs or closing
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// Call stopCamera when user leaves the page or switches input method
window.addEventListener('beforeunload', stopCamera);