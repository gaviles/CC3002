package tarea.Histograms;

import tarea.Histogram;
import tarea.Processors.StemAndLeafProcessor;

public class StemAndLeaf extends Histogram {

	public StemAndLeaf() {
		textData = "";
		histogramProcessor = new StemAndLeafProcessor();
	}
	public StemAndLeaf(String string) {
		textData = string;
		histogramProcessor = new StemAndLeafProcessor(textData);
	}	
}