package com.ysrken.nzszserver;

import java.io.IOException;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import com.ysrken.nzszserver.controller.DownloadDataController;

public class DownloadDataTest {

  @Test
  public void test() throws IOException {
	MockHttpServletRequest request = new MockHttpServletRequest();
	request.setParameter("year", "2018");
	request.setParameter("month", "6");
	request.setParameter("day", "17");
    MockHttpServletResponse response = new MockHttpServletResponse();
    new DownloadDataController().doGet(request, response);
    System.out.println(response.getWriterContent().getBuffer().toString());
    return;
  }
}
