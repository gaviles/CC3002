package Histograms;

import Tarea.Histogram;
import Processors.DotPlotProcessor;

public class DotPlot extends Histogram {
	
	public DotPlot(){}
	
	public DotPlot(String string) {
		
		setData(string);		
	}
	
	public void setData(String string){
		
		textData = string;
		histogramProcessor = new DotPlotProcessor(textData);
	}
}
