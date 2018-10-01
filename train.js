// Initialize Firebase
var config = {
    apiKey: "AIzaSyCyarUCLL83F7VsYIhqw3Bt8LcsF74-1uc",
    authDomain: "train-activity-3d43d.firebaseapp.com",
    databaseURL: "https://train-activity-3d43d.firebaseio.com",
    projectId: "train-activity-3d43d",
    storageBucket: "",
    messagingSenderId: "452144307021"
};
firebase.initializeApp(config);

var database = firebase.database();

$('#submit').on("click", function (event) {
    event.preventDefault();

    var trainName = $('#name').val().trim();
    var destination = $('#role').val().trim();
    var firstTrainTime = $('#startDate').val().trim();
    var frequency = $('#monthlyRate').val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
    });
});
database.ref().on('child_added', function (snapshot) {
    console.log(snapshot.val());

    var currentTrainName = snapshot.val().trainName;
    var currentDestination = snapshot.val().destination;
    var currentFirstTrainTime = snapshot.val().firstTrainTime;
    var currentFrequency = snapshot.val().frequency;

    var tRow = $("<tr>");


    var trainName1 = $("<td>").text(currentTrainName);
    var destination1 = $("<td>").text(currentDestination);
    var firstTrainTime1 = $("<td>").text(currentFirstTrainTime);
    var frequency1 = $("<td>").text(currentFrequency);

    tRow.append(trainName1);
    tRow.append(destination1);
    //  tRow.append(firstTrainTimeDiv);
    tRow.append(frequency1);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(currentFirstTrainTime, "HH:mm").subtract(1, "years");
    console.log("Conveted Time" + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % currentFrequency;
    console.log(tRemainder);

    var tMinutesTillTrain = currentFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    //***************************************************************************
    var nextTrain = $("<td>").text(tMinutesTillTrain);
    tRow.append(nextTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    //***************************************************************************
    var minsAway = $("<td>").text(moment(nextTrain).format("hh:mm"));
    tRow.append(minsAway);

    // Minute Until Train



    $("tbody").append(tRow);

})