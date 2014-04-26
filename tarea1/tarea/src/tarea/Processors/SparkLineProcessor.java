package tarea.processors;


public class SparkLineProcessor implements HistogramProcessor {
	
	private DataProcessor dataProcessor;
	private String histogram;
	private char[] intervalsValue;
	
	public SparkLineProcessor() {
		setIntervalsValue();
	}
	public SparkLineProcessor(String string){
		setIntervalsValue();
		dataProcessor = new DataProcessor(string);
		generateHistogram();
	}
	
	public SparkLineProcessor(String[] args){
		setIntervalsValue();
		dataProcessor = new DataProcessor(args);
		generateHistogram();
	}
	
	// Generates the *** intervals values 
	public void setIntervalsValue(){
		intervalsValue = new char[9];
		for(int i = 0; i < 9 ; i++ ){
			intervalsValue[i] = (char)(9601+i); 
		}
	}
	public void setData(String[] data){
		dataProcessor = new DataProcessor(data);
		generateHistogram();
	}
	public void setData(String string){
		dataProcessor = new DataProcessor(string);
		generateHistogram();
	}
	private void generateHistogram(){
		
		int[] datos = dataProcessor.getParsedData();
		
		StringBuilder histogramBuilder = new StringBuilder();
		
		for(int i = 0; i < datos.length ; i++ ){
			histogramBuilder.append( intervalsValue[ dataProcessor.getInterval( datos[i], 9 ) ]  );
		}
		histogram = histogramBuilder.toString();
	}
	public String getHistogram(){
		return histogram;
	}
}
