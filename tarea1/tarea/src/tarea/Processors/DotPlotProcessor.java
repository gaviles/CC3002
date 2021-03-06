package tarea.processors;

import java.util.ArrayList;

public class DotPlotProcessor implements HistogramProcessor {
	
	private DataProcessor dataProcessor;
	private String histogram;
	private String[] intervalsValue;

	public DotPlotProcessor(String string){
		setIntervalsValue();
		setData(string);	
	}
	public DotPlotProcessor() {
		setIntervalsValue();
	}
	private void setIntervalsValue(){
		intervalsValue = new String[21];
		intervalsValue[0] = "";
		for(int i = 1; i <= 20 ; i++ ){
			intervalsValue[i] = intervalsValue[(i-1)].concat("*"); 
		}
	}
	public void setData(String[] args){
		dataProcessor = new DataProcessor(args);
		generateHistogram();
	}
	
	public void setData(String string){
		dataProcessor = new DataProcessor(string);
		generateHistogram();
	}
	private void generateHistogram(){
		
		dataProcessor.sortValuesBySize();		
		ArrayList<IntervalProcessor> intervals = getValues();
		
		histogram = "valor   |                       | frecuencia\n";
		int maximumRpetitions = intervals.get(0).getSize();
		
		for(IntervalProcessor interval: intervals){
			
			String line = " ";
			int percentage = interval.getSize()*20/maximumRpetitions ;
			line = fillWithSpaces( line.concat( interval.getInterval() ) , 8 );
			line = line.concat("| ");
			line = line.concat( intervalsValue[percentage] );
			line = fillWithSpaces(line, 32 );
			line = line.concat("| ");
			line = line.concat(String.valueOf(interval.getSize()));
			histogram = histogram.concat(line).concat("\n");			
		}
	}
	
	// This function fills the given string with spaces until get the 
	// given number of length
	private String fillWithSpaces(String string, int length){
		if( string.length() < length ){
			return fillWithSpaces(string.concat(" "), length);
		}
		return string;	
	}
	
	public String getHistogram() {
		return histogram;
	}
	
	public ArrayList<IntervalProcessor> getValues(){
		return dataProcessor.getValues();
	}
}
