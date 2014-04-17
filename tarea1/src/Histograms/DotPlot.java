package Histograms;

import Tarea.Histogram;
import Processors.DotPlotProcessor;

public class DotPlot extends Histogram {

	public DotPlot(String string) {
		super();
		textData = string;
		histogramProcessor = new DotPlotProcessor(textData);
	}
}
