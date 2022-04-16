import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, doc, onSnapshot, where, query, collection } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// Firebase configuration
const app = initializeApp({
    apiKey: "AIzaSyCO4QvB5H2_eDWvVxBCq7Lycwoh2iJIf8E",
    authDomain: "presencedetection-4dcb0.firebaseapp.com",
    projectId: "presencedetection-4dcb0",
    storageBucket: "presencedetection-4dcb0.appspot.com",
    messagingSenderId: "75810056344",
    appId: "1:75810056344:web:1b0970d9eff70173cb48ed"
});


const chartEl = document.getElementById("plot").getContext('2d');
const barChart = new Chart(chartEl, {
    type: 'bar',
    data: {
        labels: ['CBB 120', 'CBB 121', 'CBB 122'],
        datasets: [{ label: 'Crowdness', data: [20, 18, 5], backgroundColor: '#960C22' }]
    },

});

const db = getFirestore(app);
const q = query(collection(db, "rooms"), where("roomID", "!=", ""));

// we should detach the listener when the user leaves
const unsubscribe = onSnapshot(q, (querySnap) => {
    const data = [];
    querySnap.forEach((room) => {
        data.push(room.data());
    });

    const labels = data.map((room) => room.roomName);
    const count = data.map((room) => room.count);
    console.log(data);
    // remove the previous data in the chart
    removeData(barChart);
    // updates the chart with the new data
    updateData(barChart, labels, count);
});

const updateData = (chart, labels, data) => {
    chart.data.labels = labels;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

const removeData = (chart) => {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
}





