$source = "http://names4ever-feed.azurewebsites.net/prijslijst-csv"
$destination = "I:\-01- Names4ever\-06- Partners\Prijslijsten\PrijslijstN4E.csv"
 
Invoke-WebRequest $source -OutFile $destination

$Excel = New-Object -Com Excel.Application;
$Excel.visible = $False;
$Excel.displayalerts=$False;
$WorkBook1 = $Excel.Workbooks.Open("I:\-01- Names4ever\-06- Partners\Prijslijsten\Werkbestanden\Prijslijst Werkbestand.xlsb");
$Excel.Run("Execute");
$WorkBook1.close($False);
$Excel.Quit();


#kopieeer bestanden naar Git FOLDER P:\-00- site-names4ever

git all -A
