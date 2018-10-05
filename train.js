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

function submitForm() {
    event.preventDefault();
    key = $(this).attr("key");
    var trainName = $('#name').val().trim();
    var destination = $('#role').val().trim();
    var firstTrainTime = $('#startDate').val().trim();
    var frequency = $('#monthlyRate').val().trim();
    if (key == undefined) {

        // alert(trainName);
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        });
    } else {

        alert(trainName); 
        database.ref(key).update({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        });
    }
    location.reload();

}
function reloadPage() {
    location.reload();
}

database.ref().on('child_added', function (snapshot) {
    console.log(snapshot.val());

    var currentTrainName = snapshot.val().trainName;
    var currentDestination = snapshot.val().destination;
    var currentFirstTrainTime = snapshot.val().firstTrainTime;
    var currentFrequency = snapshot.val().frequency;
    var key = snapshot.key;
    //  debugger;

    var tRow = $("<tr>");

    var trainName1 = $("<td>").text(currentTrainName);
    var destination1 = $("<td>").text(currentDestination);
    var firstTrainTime1 = $("<td>").text(currentFirstTrainTime);
    var frequency1 = $("<td>").text(currentFrequency);


    var button = $("<button>");
    button.addClass("remove");
    button.text("Delete");
    button.addClass("btn");
    button.addClass("btn-primary");
    button.attr("key", key);
    var remove = $("<td>").html(button);

    var button1 = $("<button>");
    button1.addClass("update");
    button1.addClass("btn");
    button1.addClass("btn-primary");
    button1.text("Update");
    button1.attr("key", key);
    button1.attr("data-toggle", "collapse");
   // button1.attr("data-toggle", "collapse");
    
    button1.attr("data-target", "#collapseOne");
    button1.attr("aria-expanded", "true");
    button1.attr("aria-controls", "collapseOne");
   

    var update = $("<td>").html(button1);



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

    var nextTrain = $("<td>").text(tMinutesTillTrain);
    tRow.append(nextTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var minsAway = $("<td>").text(moment(nextTrain).format("hh:mm"));
    tRow.append(minsAway);
    tRow.append(remove);
    tRow.append(update);

    // Minute Until Train
    $("tbody").append(tRow);

})
function removeTrain() {
    //  alert("check");
    database.ref($(this).attr("key")).remove();             //  ref.child(key).remove();
}
var playersRef = database.ref();

playersRef.on("child_removed", function (data) {
    alert("Calling refresh");
    location.reload()
});

playersRef.on("child_changed", function (data) {
    alert("Calling refresh");
    location.reload()
});

function loadTrain() {

    var ref = database.ref($(this).attr("key"));

    ref.on("value", function (snapshot) {

        //    console.log("Come on" + snapshot.key);
        var currentTrainName = snapshot.val().trainName;
        var currentDestination = snapshot.val().destination;
        var currentFirstTrainTime = snapshot.val().firstTrainTime;
        var currentFrequency = snapshot.val().frequency;
        var key = snapshot.key;
        console.log("Come on" + currentTrainName);
        alert($("#name").text);
        //     $("#timer").text(stopwatch.time);
        $("#name").val(currentTrainName);
        $('#role').val(currentDestination);
        $('#startDate').val(currentFirstTrainTime);
        $('#monthlyRate').val(currentFrequency);
        var submit = $(".submitbutton");
        debugger;
        submit.attr("key", key);

    }, function (error) {
        console.log("Error: " + error.code);
    });
}

var intervalId;
intervalId = setInterval(reloadPage, 60000);

$(document).on("click", ".remove", removeTrain);
$(document).on("click", ".update", loadTrain);
$(document).on("click", "#submit", submitForm);